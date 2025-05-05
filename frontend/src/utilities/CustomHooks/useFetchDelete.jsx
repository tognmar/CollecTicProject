import { useState } from "react";
import { api } from "../../config/axios";
import { useSelector } from "react-redux";

export default function useFetchDelete(defaultUrl = null) {
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [success, setSuccess] = useState(false);
  const bearerToken = useSelector((state) => state.user.access_token);

  const deleteResource = async (customUrl = null) => {

    const url = customUrl || defaultUrl;

    if (!url) {
      setError("No URL provided.");
      return;
    }

    if (!bearerToken) {
      setError("No access token available.");
      return;
    }

    setIsDeleting(true);
    setError(null);
    setSuccess(false);

    try {
      await api.delete(url, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      setSuccess(true);
    } catch (err) {
      setError("An error occurred while deleting the resource.");
      setSuccess(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteResource,
    isDeleting,
    error,
    success,
  };
}
