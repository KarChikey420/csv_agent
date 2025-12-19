import { AgentType } from "../types";
import { agentService } from "./apiService";

export const getAgentResponse = async (
  query: string, 
  type: AgentType, 
  history: { role: string; parts: { text: string }[] }[] = [],
  file?: File
) => {
  try {
    let response: string;
    
    switch (type) {
      case AgentType.REACT:
        response = await agentService.reactAgent(query, file);
        break;
      case AgentType.MULTI:
        response = await agentService.multiAgent(query, file);
        break;
      case AgentType.MEMORY:
        response = await agentService.memoryAgent(query);
        break;
      default:
        response = await agentService.chat(query, file);
    }

    return {
      text: response || "Dataset analysis failed to return a result.",
      thinking: "" 
    };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
