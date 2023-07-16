import React, { useState, useEffect, useRef } from "react";
import "./card.scss";

const Card: React.FC = () => {
  const [beerData, setBeerData] = useState<any[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [visibleCards, setVisibleCards] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [areCardsVisible, setAreCardsVisible] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    beerId: number
  ) => {
    event.preventDefault();
    if (selectedCardIds.includes(beerId)) {
      setSelectedCardIds((prevData) => prevData.filter((id) => id !== beerId));
    } else {
      setSelectedCardIds((prevData) => [...prevData, beerId]);
    }
  };

  const handleDeleteCards = () => {
    setBeerData((prevData) =>
      prevData.filter((beer) => !selectedCardIds.includes(beer.id))
    );
    setSelectedCardIds([]);
    setAreCardsVisible(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const { scrollTop, clientHeight, scrollHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight) {
          loadMoreCards();
        }
      }
    };

    const loadMoreCards = () => {
      setTimeout(() => {
        const startIndex = visibleCards.length;
        const endIndex = startIndex + 5;
        const nextBatch = beerData.slice(startIndex, endIndex);
        setVisibleCards((prevCards) => [...prevCards, ...nextBatch]);
      }, 300);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [visibleCards, beerData]);

  useEffect(() => {
    setVisibleCards(beerData.slice(0, 15));
    setAreCardsVisible(beerData.length === 0);
  }, [beerData]);

  useEffect(() => {
    fetchBeerData(1);
  }, []);

  const fetchNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    fetchBeerData(currentPage + 1);
  };

  const fetchBeerData = async (currentPage: number | undefined) => {
    try {
      const response = await fetch(
        `https://api.punkapi.com/v2/beers?page=${currentPage}`
      );
      const json = await response.json();
      setBeerData(json);
      console.log(json);
      console.log(response);
    } catch (error) {
      console.error("Error fetching beer data:", error);
    }
  };

  return (
    <>
      <button
        className="deleteButton"
        onClick={handleDeleteCards}
        disabled={selectedCardIds.length === 0}
      ></button>
      <button
        className="loadingButton"
        onClick={fetchNextPage}
        disabled={!areCardsVisible}
      ></button>
      <div ref={scrollContainerRef} id="mycustom-scroll">
        {visibleCards.map((beer, index) => (
          <div
            key={`${beer.id}-${index}`}
            className={`card ${
              selectedCardIds.includes(beer.id) ? "selected" : ""
            }`}
            onContextMenu={(e) => handleContextMenu(e, beer.id)}
          >
            <img className="beerImg" src={beer.image_url} alt={beer.name} />
            <h1>{beer.name}</h1>
            <h4>First brewed: {beer.first_brewed}</h4>
            <h4>Vol: {beer.ph}%</h4>
            <p>{beer.brewers_tips}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Card;
