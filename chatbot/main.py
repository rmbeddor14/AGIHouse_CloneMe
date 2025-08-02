from fastapi import FastAPI
from pydantic import BaseModel
from chatbot import simulate_conversation

app = FastAPI()

class SimulationRequest(BaseModel):
    transcript: str
    task: str

@app.post("/simulate")
def simulate(request: SimulationRequest):
    result = simulate_conversation(request.transcript, request.task)
    return {"conversation": result}
