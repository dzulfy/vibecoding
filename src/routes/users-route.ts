import { Elysia, t } from "elysia";
import { registerUser, loginUser, getCurrentUser, logoutUser, updateUser } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api" })
  .post("/users", async ({ body, set }) => {
    try {
      return await registerUser(body);
    } catch (error: any) {
      if (error.message === "Email sudah terdaftar") {
        set.status = 400;
        return { error: error.message };
      }
      set.status = 500;
      return { error: "Internal Server Error" };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
      password: t.String(),
    })
  })
  .post("/users/login", async ({ body, set }) => {
    try {
      return await loginUser(body);
    } catch (error: any) {
      if (error.message === "Email atau password salah") {
        set.status = 401;
        return { error: error.message };
      }
      set.status = 500;
      return { error: "Internal Server Error" };
    }
  }, {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String(),
    })
  })
  .get("/users/current", async ({ headers, set }) => {
    try {
      const authorization = headers.authorization;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
      }

      const token = authorization.split(" ")[1];
      if (!token) {
        throw new Error("Unauthorized");
      }

      return await getCurrentUser(token);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        set.status = 401;
        return { error: error.message };
      }
      set.status = 500;
      return { error: "Internal Server Error" };
    }
  })
  .delete("/users/logout", async ({ headers, set }) => {
    try {
      const authorization = headers.authorization;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
      }

      const token = authorization.split(" ")[1];
      if (!token) {
        throw new Error("Unauthorized");
      }

      return await logoutUser(token);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        set.status = 401;
        return { error: error.message };
      }
      set.status = 500;
      return { error: "Internal Server Error" };
    }
  })
  .patch("/users/current", async ({ headers, body, set }) => {
    try {
      const authorization = headers.authorization;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
      }

      const token = authorization.split(" ")[1];
      if (!token) {
        throw new Error("Unauthorized");
      }

      return await updateUser(token, body);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        set.status = 401;
        return { error: error.message };
      }
      set.status = 500;
      return { error: "Internal Server Error" };
    }
  }, {
    body: t.Object({
      name: t.Optional(t.String()),
      password: t.Optional(t.String()),
    })
  });
