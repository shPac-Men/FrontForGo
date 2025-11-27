import "./AlbumPage.css";
import { useEffect, useState } from "react";
import type { FC } from 'react';
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { useParams } from "react-router-dom";
import { getAlbumById } from "../../modules/ITunesAPI";
import type { ITunesMusic } from "../../modules/ITunesAPI";
import { Col, Row, Spinner, Image } from "react-bootstrap";
import { SONGS_MOCK } from "../../modules/mock";
import defaultImage from "../../assets/react.svg";

export const AlbumPage: FC = () => {
  const [pageData, setPageData] = useState<ITunesMusic>();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    
    getAlbumById(id)
      .then((response) => setPageData(response.results[0]))
      .catch(() => {
        // В случае ошибки используем mock данные, фильтруем по id
        const mockAlbum = SONGS_MOCK.find(
          (album) => String(album.collectionId) === id
        );
        setPageData(mockAlbum);
      });
  }, [id]);

  return (
    <div>
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ALBUMS, path: ROUTES.ALBUMS },
          { label: pageData?.collectionCensoredName || "Альбом" },
        ]}
      />
      
      {pageData ? (
        <div className="container">
          <Row>
            <Col md={6}>
              <p>
                Альбом: <strong>{pageData.collectionCensoredName}</strong>
              </p>
              <p>
                Исполнитель: <strong>{pageData.artistName}</strong>
              </p>
            </Col>
            <Col md={6}>
              <Image
                src={pageData.artworkUrl100 || defaultImage}
                alt={pageData.collectionCensoredName}
                width={100}
                thumbnail
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div className="album_page_loader_block">
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
};