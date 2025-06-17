import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier";
}

export default function UserManagement({
  setLoading,
}: {
  setLoading: (b: boolean) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, [setLoading]);

  return (
    <div>
      <h2>User Management</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add forms for add/edit/delete as needed */}
    </div>
  );
}
