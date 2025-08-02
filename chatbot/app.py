import streamlit as st
import requests
from chatbot import simulate_conversation, respond_as_character, extract_names_from_task

st.set_page_config(page_title="🧠 Meeting Follow-Up", layout="centered")
st.title("🧠 Meeting Follow-Up Conversation Simulator")

uploaded_file = st.file_uploader("Upload meeting transcript (.txt)", type=["txt"])
transcript_text = None
tasks = []
selected_task = None

# Step 1: Load transcript and extract tasks
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

# Step 2: Select task from dropdown
if "tasks" in st.session_state:
    selected_task = st.selectbox("Choose a task to simulate:", st.session_state["tasks"])

# # Step 3: Simulate full conversation
# if selected_task and transcript_text:
#     if st.button("🎭 Simulate Full Conversation"):
#         with st.spinner("Simulating..."):
#             result = simulate_conversation(transcript_text, selected_task)
#             st.markdown("### 💬 Simulated Conversation")
#             st.markdown(result)

# Step 4: Roleplay Chat
if selected_task and transcript_text:
    st.divider()
    st.subheader("💬 Roleplay Chat")

    name_info = extract_names_from_task(selected_task)
    bot_name = name_info.get("initiator", "Chatbot")
    user_name = name_info.get("target", "You")

    st.markdown(f"**You are:** 👤 {user_name} talking to 🤖 {bot_name}")

    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

    user_input = st.chat_input(f"Message from {user_name}")

    if user_input:
        st.session_state.chat_history.append({"role": "user", "content": user_input})
        with st.spinner(f"{bot_name} is replying..."):
            reply = respond_as_character(transcript_text, selected_task, st.session_state.chat_history)
            st.session_state.chat_history.append({"role": "assistant", "content": reply})

    for msg in st.session_state.chat_history:
        if msg["role"] == "user":
            st.chat_message("user").write(msg["content"])
        else:
            st.chat_message("assistant").write(msg["content"])
