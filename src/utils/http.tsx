const backendUrl = "http://localhost:8002";

export async function httpGet(path: string) {
  const response = await fetch(`${backendUrl}/api/${path}`, {
    method: "GET",
  });

  if (response.ok) {
    const message = await response.json();
    return message;
  } else {
    const error = await response.json();
    throw new Error(error);
  }
}
