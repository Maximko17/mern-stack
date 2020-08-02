import React, { useState, useContext, useCallback, useEffect } from "react";
import { useHttp } from "../hooks/httpHook";
import { AuthContext } from "../context/authContext";
import { Loader } from "../components/Loader";
import { LinksList } from "../components/LinksList";

export const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const getLinks = useCallback(async () => {
    try {
      const fetchedLinks = await request(`/api/link`, "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setLinks(fetchedLinks);
    } catch (error) {}
  }, [token, request]);

  useEffect(() => {
    getLinks();
  }, [getLinks]);

  if (loading) {
    return <Loader />;
  }

  return <>{!loading && <LinksList links={links} />}</>;
};
