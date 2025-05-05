import {useEffect, useState} from "react";
import {api} from "../../config/axios";
import {useSelector} from "react-redux"


export default function useFetchGet(url) {
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState(null);
    const bearerToken = useSelector((state) => state.user.access_token)


    useEffect(() => {
        if (!bearerToken) {
            console.log("Token is not available yet");
            return; // Skip the API request if no token is available
        }
        if (!url) {
            return; // Skip the API request if no URL is provided
        }

        const fetchData = async () => {
            try {
                setIsFetching(true);
                const response = await api.get(url, {
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                    },
                });
                setData(response.data);
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching data.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [url, bearerToken]);// Re-run when bearerToken or url changes

    return {
        data,
        error,
        isFetching,
    };
}