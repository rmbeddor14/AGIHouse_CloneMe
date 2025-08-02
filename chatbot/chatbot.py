import os
import openai
import json

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def simulate_conversation(transcript: str, task: str, model="gpt-3.5-turbo"):
    messages = [
        {"role": "system", "content": "You simulate realistic follow-up conversations between colleagues based on meeting transcripts."},
        {"role": "user", "content": f"""Meeting Transcript:
{transcript}

Now, simulate the conversation that would happen if the task "{task}" were carried out. Write it as a dialogue between the relevant people. Keep it natural and relevant to the context of the meeting."""}
    ]

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.7
    )

    return response.choices[0].message.content

def respond_as_character(transcript: str, task: str, history: list, model="gpt-3.5-turbo"):
    speaker = extract_names_from_task(task).get("initiator", "Chatbot")

    messages = [
        {"role": "system", "content": f"You are {speaker}, continuing a conversation based on a meeting transcript."},
        {"role": "user", "content": f"""Meeting Transcript:
{transcript}

Task:
{task}

Only respond as {speaker} in the conversation below.
"""}
    ] + history

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.7
    )

    return response.choices[0].message.content

def extract_names_from_task(task: str):
    prompt = f"""
Task: "{task}"

From the task above, extract:
- Who is supposed to initiate the conversation? (the one doing the task)
- Who are they talking to?

Return the names only as JSON like:
{{"initiator": "Christie", "target": "Jane"}}
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    try:
        return json.loads(response.choices[0].message.content.strip())
    except:
        return {"initiator": "Chatbot", "target": "You"}
