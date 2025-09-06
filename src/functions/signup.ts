export function handler(event: any) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello, world!" }),
  };
}
