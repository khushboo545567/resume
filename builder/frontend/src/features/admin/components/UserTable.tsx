// UserTable.tsx
import { useUsers } from "../hooks/useUsers";
import { useState } from "react";
import UserDetailsModal from "./UserDetailsModal";
import { useUserDetails } from "../hooks/useUserDetails";
import { useUpdateUserStatus } from "../hooks/useUpdateUserStatus";

import DeleteUserModal from "./DeleteUserModal";

import { useDeleteUser } from "../hooks/useDeleteUser";

export default function UserTable() {
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);

  const { data: details } = useUserDetails(selectedId, open);
  const { data, isLoading } = useUsers();
  const { mutate: changeStatus } = useUpdateUserStatus();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteId, setDeleteId] = useState("");

  const { mutate: deleteUser } = useDeleteUser();

  if (isLoading) {
    return <p className="text-nav-text">Loading...</p>;
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-navbar shadow-sm">
      <table className="min-w-[1000px] w-full">
        <thead>
          <tr className="border-b border-border-popup bg-background">
            <th className="p-4 text-left text-heading">Name</th>
            <th className="p-4 text-left text-heading">Email</th>
            <th className="p-4 text-left text-heading">Role</th>
            <th className="p-4 text-left text-heading">Status</th>
            <th className="p-4 text-left text-heading">Joined</th>
            <th className="p-4 text-center text-heading">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((user: any) => (
            <tr key={user._id} className="border-b border-border-popup">
              <td className="p-4 text-heading">{user.fullName}</td>

              <td className="p-4 text-nav-text">{user.email}</td>

              <td className="p-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    user.role === "admin"
                      ? "bg-btn/15 text-heading"
                      : "bg-btn-hover-bg text-heading"
                  }`}
                >
                  {user.role}
                </span>
              </td>

              {/* ✅ New Status Column Added */}
              <td className="p-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    user.status === "active"
                      ? "bg-green-700/10 text-green-700"
                      : "bg-red-600/10 text-red-600"
                  }`}
                >
                  {user.status ?? "active"}
                </span>
              </td>

              <td className="p-4 text-nav-text">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              <td className="p-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedId(user._id);
                      setOpen(true);
                    }}
                    className="rounded bg-btn px-3 py-1 text-sm text-btn-text hover:bg-btn-hover"
                  >
                    👁 View
                  </button>

                  <button
                    onClick={() => {

                      changeStatus({
                        id: user._id,
                        status:
                          user.status === "active" ? "suspended" : "active",
                      });
                    }}
                    className={`rounded px-3 py-1 text-sm text-white ${
                      user.status === "active"
                        ? "bg-orange-500 hover:opacity-90"
                        : "bg-green-600 hover:opacity-90"
                    }`}
                  >
                    {user.status === "active" ? "🚫 Suspend" : "✅ Activate"}
                  </button>

                  {user.role === "admin" ? (
                    <button
                      disabled
                      className="cursor-not-allowed rounded bg-btn/30 px-3 py-1 text-sm text-btn-text"
                    >
                      🔒 Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setDeleteId(user._id);
                        setDeleteOpen(true);
                      }}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:opacity-90"
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DeleteUserModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDelete={() => {
          deleteUser(deleteId);

          setDeleteOpen(false);
        }}
      />

      <UserDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        data={details}
      />
    </div>
  );
}
