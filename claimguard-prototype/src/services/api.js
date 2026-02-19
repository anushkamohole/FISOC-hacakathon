export async function callBackend() {
  const res = await fetch("http://127.0.0.1:8000/analyze");
  const data = await res.json();
  return data;
}
