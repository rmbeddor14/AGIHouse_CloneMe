import streamlit as st
import requests
from chatbot import simulate_conversation

st.set_page_config(page_title="🧠 Meeting Follow-Up", layout="centered")
st.title("🧠 Meeting Follow-Up Conversation Simulator")

uploaded_file = st.file_uploader("Upload meeting transcript (.txt)", type=["txt"])

transcript_text = None
tasks = []
selected_task = None

# STEP 1: Read file and extract tasks
if uploaded_file:
    transcript_text = uploaded_file.read().decode("utf-8")

    if st.button("📌 Extract Tasks from Transcript"):
        with st.spinner("Extracting tasks..."):
            try:
                response = requests.post(
                    "http://54.91.226.222:8000/extract-tasks",
                    headers={"Content-Type": "application/json"},
                    json={"transcript": transcript_text}
                )
                if response.status_code == 200:
                    raw_tasks = response.json().get("tasks", "")
                    tasks = [t.strip("- ").strip() for t in raw_tasks.split("\n") if t.strip()]
                    st.session_state["tasks"] = tasks
                    st.success("Tasks extracted successfully!")
                else:
                    st.error("Failed to extract tasks.")
            except Exception as e:
                st.error(f"Error: {e}")

# STEP 2: Select task
if "tasks" in st.session_state:
    selected_task = st.selectbox("Choose a task to simulate:", st.session_state["tasks"])

# STEP 3: Simulate conversation
if selected_task and transcript_text:
    if st.button("🎭 Simulate Conversation"):
        with st.spinner("Simulating..."):
            result = simulate_conversation(transcript_text, selected_task)
            st.markdown("### 💬 Simulated Conversation")
            st.markdown(result)
