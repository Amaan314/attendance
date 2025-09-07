import asyncio
import websockets
import sys

async def listen_to_attendance():
    if len(sys.argv) < 3:
        print("Usage: python test_websocket.py <session_id> <auth_token>")
        return
        
    session_id = sys.argv[1]
    token = sys.argv[2]
    
    # Append the token as a query parameter
    uri = f"ws://127.0.0.1:8000/teacher/ws/attendance/{session_id}?token={token}"
    
    print(f"Connecting to ws://127.0.0.1:8000/teacher/ws/attendance/{session_id}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connection established. Waiting for attendance updates...")
            try:
                while True:
                    message = await websocket.recv()
                    print(f"\n<<< RECEIVED UPDATE: {message}\n")
            except websockets.ConnectionClosed:
                print("Connection closed.")
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"Connection failed: {e.status_code} {e.reason}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(listen_to_attendance())
