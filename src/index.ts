import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import moduleRoutes from "./routes/moduleRoutes";
import projectRoutes from "./routes/projectRoutes";
import responseRoutes from "./routes/responseRoutes";
import ruleRoutes from "./routes/ruleRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Add error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.use("/modules", moduleRoutes);
app.use("/projects", projectRoutes);
app.use("/responses", responseRoutes);
app.use("/projects", ruleRoutes);

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

app.listen(3001, () => console.log("API running on http://localhost:3001"));
