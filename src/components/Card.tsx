import React, { useState, useEffect, useRef } from "react";
import "./card.scss";

const Card: React.FC = () => {
  const [beerData, setBeerData] = useState<any[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [visibleCards, setVisibleCards] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      }, 500);
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
  }, [beerData]);

  useEffect(() => {
    fetchBeerData();
  }, []);

  const fetchBeerData = async () => {
    try {
      let page = 1;
      const allBeers: React.SetStateAction<any[]> = [];

      while (true) {
        const response = await fetch(
          `https://api.punkapi.com/v2/beers?page=${page}`
        );
        const data = await response.json();
        if (data.length === 0) {
          break;
        }
        allBeers.push(...data);
        page++;
      }

      setBeerData(allBeers);
      console.log(allBeers);
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
