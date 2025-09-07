import { jwtDecode } from "jwt-decode";

// const BASE_URL = "http://localhost:8000";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await response.json();
  return data;
};

export const getMe = async (token) => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data;
};

export const getTeacherLectures = async (token, dateString) => {
  const response = await fetch(
    `${BASE_URL}/teacher/lectures?selected_date=${dateString}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch lectures");
  }

  const data = await response.json();
  return data;
};

export const refreshQrToken = async (token, sessionId) => {
  const response = await fetch(
    `${BASE_URL}/teacher/attendance/qr/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to refresh QR token");
  }

  const data = await response.json();
  return data;
};

export const startAttendanceSession = async (token, slotId) => {
  const response = await fetch(
    `${BASE_URL}/teacher/attendance/start?slot_id=${slotId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to start attendance session");
  }

  const data = await response.json();
  return data;
};

export const scanAttendance = async (token, sessionId, qrToken) => {
  const response = await fetch(`${BASE_URL}/student/attendance/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ session_id: sessionId, token: qrToken }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to scan attendance");
  }

  const data = await response.json();
  return data;
};
("");
