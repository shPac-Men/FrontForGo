import "./ITunesPage.css";
import { useState } from "react";
import type { FC } from 'react';
import { Col, Row, Spinner } from "react-bootstrap";
import { getMusicByName } from "../../modules/ITunesAPI";
import type { ITunesMusic } from "../../modules/ITunesAPI";
import InputField from "../../components/InputField/InputField";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import MusicCard from "../../components/MusicCard/MusicCard";
import { useNavigate } from "react-router-dom";
import { SONGS_MOCK } from "../../modules/mock";

const ITunesPage: FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [music, setMusic] = useState<ITunesMusic[]>([]);

  const navigate = useNavigate();

  const handleSearch = () => {
    setLoading(true);
    getMusicByName(searchValue)
      .then((response) => {
        setMusic(
          response.results.filter((item) => item.wrapperType === "track")
        );
        setLoading(false);
      })
      .catch(() => {
        // В случае ошибки используем mock данные, фильтруем по имени
        setMusic(
          SONGS_MOCK.filter((item) =>
            item.collectionCensoredName
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          )
        );
        setLoading(false);
      });
  };

  const handleSetValue = (value: string) => {
    setSearchValue(value);
  };

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.ALBUMS}/${id}`);
  };

  return (
    <div className="container">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.HOME }]} />
      
      <InputField
        value={searchValue}
        setValue={handleSetValue}
        loading={loading}
        onSubmit={handleSearch}
      />

      {loading && (
        <div className="loadingBg">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && !music.length && (
        <div>
          <h1>К сожалению, пока ничего не найдено :(</h1>
        </div>
      )}

      {!loading && music.length > 0 && (
        <Row xs={1} md={2} lg={4} className="g-4">
          {music.map((item, index) => (
            <Col key={index}>
              <MusicCard
                imageClickHandler={() => handleCardClick(item.collectionId)}
                {...item}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ITunesPage;