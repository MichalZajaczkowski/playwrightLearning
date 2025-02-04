// Definiowanie typu i funkcji w TypeScript
type User = {
  name: string;
  age: number;
};

const greetUser = (user: User): string => {
  return `Cześć, ${user.name}! Masz ${user.age} lat.`;
};

// Przykład użycia
const user: User = { name: "Michał", age: 30 };
console.log(greetUser(user));
