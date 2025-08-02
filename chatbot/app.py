import streamlit as st
from chatbot import ask_chatbot

st.set_page_config(page_title="Chatbot UI", layout="centered")

st.title("🤖 Simple Chatbot UI")

user_input = st.text_input("You:", key="input")

if user_input:
    response = ask_chatbot(user_input)
    st.markdown(f"**Bot:** {response}")
