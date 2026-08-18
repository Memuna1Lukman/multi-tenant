import { useEffect, useContext, useState, createContext, useCallback } from "react";
import { createWorkSpace, getWorkSpace } from '../services/workspace';

export const WorkContext = createContext();

export function WorkProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWorkSpace();
      const list = Array.isArray(data) ? data : (data ? [data] : []);
      setWorkspaces(list);
      if (list.length > 0) {
        setSelectedWorkspace((prev) => {
          if (prev && list.some((ws) => ws.id === prev.id || ws.name === prev.name)) {
            return prev;
          }
          return list[0];
        });
      }
      return list;
    } catch (err) {
      console.log("Failed to fetch workspaces:", err);
      setError(err.message || "Failed to load workspaces");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getWorkSpace()
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : (data ? [data] : []);
        setWorkspaces(list);
        if (list.length > 0) {
          setSelectedWorkspace((prev) => {
            if (prev && list.some((ws) => ws.id === prev.id || ws.name === prev.name)) {
              return prev;
            }
            return list[0];
          });
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.log("Failed to fetch workspaces:", err);
          setError(err.message || "Failed to load workspaces");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const createWork = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const workspace = await createWorkSpace(data);
      if (workspace) {
        setWorkspaces((prev) => [...prev, workspace]);
        setSelectedWorkspace(workspace);
      }
      return workspace;
    } catch (err) {
      console.log("Error creating workspace:", err);
      setError(err.message || "Failed to create workspace");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getWork = async (data) => {
    try {
      setLoading(true);
      setError(null);
      return await getWorkSpace(data);
    } catch (err) {
      console.log("Error getting workspace:", err);
      setError(err.message || "Failed to get workspace");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkContext.Provider
      value={{
        workspaces,
        selectedWorkspace,
        setSelectedWorkspace,
        loading,
        error,
        createWork,
        getWork,
        fetchWorkspaces,
        name: workspaces,
      }}
    >
      {children}
    </WorkContext.Provider>
  );
}

export default function useWork() {
  return useContext(WorkContext) || {};
}

