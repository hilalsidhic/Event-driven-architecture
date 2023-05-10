from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from redis_om import get_redis_connection,HashModel
import consumers
import json


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

redis = get_redis_connection(
    host='redis-12389.c244.us-east-1-2.ec2.cloud.redislabs.com',
    port=12389,
    password='o2WBFJ5yPZoeDLh2AxCZOR7bKEg8gyDL',
    decode_responses=True
)



class Delivery(HashModel):
    budget: int = 0 
    notes : str = ''

    class Meta:
        database = redis

class Event(HashModel):
    delivery_id: str = None 
    type: str
    data: str

    class Meta:
        database = redis



@app.get('/deliveries/{pk}/status')
async def status(pk: str):
    data = redis.get(f'delivery:{pk}')
    if data is not None:
        return json.loads(data)
    return {}

@app.post('/deliveries/create')
async def create(request: Request):
    body = await request.json()
    delivery = Delivery(budget=body['data']['budget'], notes=body['data']['notes']).save()
    event = Event(delivery_id=delivery.pk, type=body['type'], data=json.dumps(body['data'])).save()
    state = consumers.create_delivery(delivery, event)
    redis.set(f'delivery:{delivery.pk}', json.dumps(state))
    # print(state)    
    return state


@app.post('/events')
async def dispatch(request: Request):
    body = await request.json()
    delivery_id = body['delivery_id']
    event = Event(delivery_id=delivery_id, type=body['type'], data=json.dumps(body['data'])).save() 
    state = await status(delivery_id)
    # print(state)
    new_state  = consumers.CONSUMERS[event.type](state, event)
    redis.set(f'delivery:{delivery_id}', json.dumps(new_state))
    return new_state

