import type { FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import "./MusicCard.css";
import defaultImage from "../../assets/react.svg";

interface Props {
  wrapperType: string;
  artworkUrl100: string;
  artistName: string;
  collectionCensoredName: string;
  trackViewUrl: string;
  collectionId: number;
  imageClickHandler: () => void;
}

const MusicCard: FC<Props> = ({ 
  artworkUrl100, 
  artistName, 
  collectionCensoredName, 
  trackViewUrl,
  imageClickHandler 
}) => {
  return (
    <Card className="music-card">
      <Card.Img 
        variant="top" 
        src={artworkUrl100 || defaultImage} 
        alt={collectionCensoredName}
        onClick={imageClickHandler}
        className="music-card__image clickable"
      />
      <Card.Body>
        <Card.Title className="music-card__title">{artistName}</Card.Title>
        <Card.Text className="music-card__text">{collectionCensoredName}</Card.Text>
        <Button 
          variant="primary" 
          href={trackViewUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="music-card__button"
        >
          Открыть в iTunes
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MusicCard;