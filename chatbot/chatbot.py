import os
import openai

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
