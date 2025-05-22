import  { respond } from "express"
import fs from "fs"

export const gda_executor = async (Request: request: Request) => {
  const url = "https://raw.githubusercontent.com/WM-AI-TECH-IA/GD-A/master/core/agents/gda_executor_agent.js"
  const res = await fetch(url)
  const body = await res.text()

  return respond.json({
    message: "Execution des agents autonomes iniciée.",
    output: body
  })
}
