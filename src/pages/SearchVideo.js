import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { Card, Avatar } from "antd";
import { Button, Radio } from "antd";
import { DownOutlined } from "@ant-design/icons";
const { Meta } = Card;
const { Search } = Input;

const exampleQuery = [
  // use this for testing to not destroy the api usage
  {
    title:
      "Pokemon Brilliant Diamond &amp; Shining Pearl News - Official Trailer",
    channelTitle: "IGN",
    url: "https://i.ytimg.com/vi/jtFOomOsR4s/hqdefault.jpg",
    videoId: "jtFOomOsR4s",
  },
  {
    title: "Pokémon Legends: Arceus | New Gameplay Trailer",
    channelTitle: "GameSpot",
    url: "https://i.ytimg.com/vi/CUhP8-uA5vc/hqdefault.jpg",
    videoId: "CUhP8-uA5vc",
  },
  {
    title: "The Lost Tower! Pokemon Diamond &amp; Pokemon Pearl - Part 6!",
    channelTitle: "AbdallahSmash026",
    url: "https://i.ytimg.com/vi/MEHiVSSfL-Y/hqdefault_live.jpg",
    videoId: "MEHiVSSfL-Y",
  },
  {
    title: "The Eclipse 🌒 | Pokémon Evolutions Episode 2",
    channelTitle: "The Official Pokémon YouTube channel",
    url: "https://i.ytimg.com/vi/n-qLMis6ids/hqdefault.jpg",
    videoId: "n-qLMis6ids",
  },
  {
    title: "The Official Pokémon YouTube channel",
    channelTitle: "The Official Pokémon YouTube channel",
    url: "https://yt3.ggpht.com/bTRC_zTlnQWC3YkjUv2Sgch2Bmp1iW0RUBFgqv7KhfBgUbZUa8bX2tArMeiPPMnE--FL_aXz=s800-c-k-c0xffffffff-no-rj-mo",
  },
  {
    title: "The Champion 🏆 | Pokémon Evolutions Episode 1",
    channelTitle: "The Official Pokémon YouTube channel",
    url: "https://i.ytimg.com/vi/v56BRim3g0w/hqdefault.jpg",
    videoId: "v56BRim3g0w",
  },
  {
    title:
      "Introducing Pokétch and Amity Square | Pokémon Brilliant DiamondPokémon Shining Pearl",
    channelTitle: "Pokémon Asia ENG",
    url: "https://i.ytimg.com/vi/DNCk_8pyQmk/hqdefault.jpg",
    videoId: "DNCk_8pyQmk",
  },
  {
    title: "Frenzied Pokémon nobles | Pokémon Legends: Arceus",
    channelTitle: "Pokémon Asia ENG",
    url: "https://i.ytimg.com/vi/aDS03i_Yr0Q/hqdefault.jpg",
    videoId: "aDS03i_Yr0Q",
  },
  {
    title: "Ash&#39;s Top 10 Strongest Pokemon!",
    channelTitle: "Dobbs",
    url: "https://i.ytimg.com/vi/tC7MEe6yiCc/hqdefault.jpg",
    videoId: "tC7MEe6yiCc",
  },
  {
    title: "Pokémon Presents | 8.18.21",
    channelTitle: "The Official Pokémon YouTube channel",
    url: "https://i.ytimg.com/vi/kdja9m4YlT4/hqdefault.jpg",
    videoId: "kdja9m4YlT4",
  },
  {
    title: "ENTER PIKACHU! | Pokémon Journeys: The Series Episode 1",
    channelTitle: "The Official Pokémon YouTube channel",
    url: "https://i.ytimg.com/vi/8SJSS_CB6jE/hqdefault.jpg",
    videoId: "8SJSS_CB6jE",
  },
  {
    title: "HIDDEN POKEMON CARDS FOUND UNDER WALMART SHELF! (opening it)",
    channelTitle: "RealBreakingNate",
    url: "https://i.ytimg.com/vi/YjsD6NngJFo/hqdefault.jpg",
    videoId: "YjsD6NngJFo",
  },
  {
    title: "*NEW V-UNION POKEMON CARDS ARE HERE!* Opening ALL 3 Boxes!",
    channelTitle: "Leonhart",
    url: "https://i.ytimg.com/vi/xD44bb5QF48/hqdefault.jpg",
    videoId: "xD44bb5QF48",
  },
  {
    title: "Novo Pokemon lançado no POKEMON UNITE Mamoswine Gameplay br",
    channelTitle: "Estação HD",
    url: "https://i.ytimg.com/vi/lyUHJlQw5Rc/hqdefault.jpg",
    videoId: "lyUHJlQw5Rc",
  },
  {
    title: "Pokemon moves, literally. The full compiled series (Remastered)",
    channelTitle: "NCHProductions",
    url: "https://i.ytimg.com/vi/k2H6grOH7Wo/hqdefault.jpg",
    videoId: "k2H6grOH7Wo",
  },
  {
    title: "Dragonair vs. Charizard! | Pokémon: Master Quest | Official Clip",
    channelTitle: "The Official Pokémon YouTube channel",
    url: "https://i.ytimg.com/vi/E-A_pn1_pCw/hqdefault.jpg",
    videoId: "E-A_pn1_pCw",
  },
  {
    title:
      "What the New Pokémon Trailers Didn&#39;t Tell You (Legends, Diamond &amp; Pearl Remakes)",
    channelTitle: "GameXplain",
    url: "https://i.ytimg.com/vi/BYS01K_SiUY/hqdefault.jpg",
    videoId: "BYS01K_SiUY",
  },
  {
    title:
      "*RISKING IT ALL FOR CHARIZARD!* Vintage Packs Pokemon Cards Opening!",
    channelTitle: "Leonhart",
    url: "https://i.ytimg.com/vi/QsvNh_ZtwsU/hqdefault.jpg",
    videoId: "QsvNh_ZtwsU",
  },
  {
    title: "First To Get A Shiny Pokemon Rainbow Team Wins",
    channelTitle: "PokeMEN7 Plays",
    url: "https://i.ytimg.com/vi/VkMujofe35E/hqdefault.jpg",
    videoId: "VkMujofe35E",
  },
  {
    title: "BOMBA !! REVELADO NOVO POKÉMON EVOLUÇÃO DO SCYTHER !!",
    channelTitle: "LeeGengar",
    url: "https://i.ytimg.com/vi/K7nSCOgCPJM/hqdefault.jpg",
    videoId: "K7nSCOgCPJM",
  },
  {
    title:
      "【公式】『ポケットモンスター ブリリアントダイヤモンド・シャイニングパール』NEWS #01　ポケッチ / ふれあいひろば篇",
    channelTitle: "ポケモン公式YouTubeチャンネル",
    url: "https://i.ytimg.com/vi/p5UqQD3GT0E/hqdefault.jpg",
    videoId: "p5UqQD3GT0E",
  },
  {
    title:
      "KLEAVOR NUEVO POKÉMON! EPIC TRAILER Pokémon LEGENDS! Pokémon Leyendas Arceus REACCIÓN ÉPICA",
    channelTitle: "Folagor03",
    url: "https://i.ytimg.com/vi/lqwLj0bcqEk/hqdefault.jpg",
    videoId: "lqwLj0bcqEk",
  },
  {
    title: "Entei | Pokémon: Master Quest | Clip oficial",
    channelTitle: "PokemonOficialES",
    url: "https://i.ytimg.com/vi/5dGkxBDXEG8/hqdefault.jpg",
    videoId: "5dGkxBDXEG8",
  },
  {
    title:
      "DO I HAVE A 100% COMPLETE EVOLVING SKIES POKEMON CARD BINDER?  [opening]",
    channelTitle: "RealBreakingNate",
    url: "https://i.ytimg.com/vi/UE05tr8L310/hqdefault.jpg",
    videoId: "UE05tr8L310",
  },
];

const SearchVideo = () => {
  const [search, setSearch] = useState("");
  const [queryResult, setQueryResult] = useState(exampleQuery);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slice, setSlice] = useState([0, 9]);

  const onSearch = (value) => {
    console.log("queryResult:", value);
    setLoading(true);
    // setQueryResult(value.target.value);
    setSearch(value);
    // setInputDisabled(true);
  };

  const selectVideo = (key) => {
    // returns info for the one vid  you select
    console.log(queryResult[key]);
  };

  const extendSearch = () => {
    setSlice((prev) => {
      return [prev[0], prev[1] + 9];
    });
  };

  useEffect(() => {
    if (search != "") {
      fetch(`localhost:5000/get/${search}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetch youtube", data);
          setQueryResult(data.items);
          setSlice((prev) => {
            return [0, 9];
          });
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [search]);

  return (
    <div style={{ margin: "50px" }}>
      <Search
        placeholder="Search for YouTube video"
        allowClear
        enterButton
        onSearch={onSearch}
        size="large"
        disabled={inputDisabled}
        style={{ display: "block", marginBottom: "50px" }}
      />
      <Card>
        {queryResult.length > 0 &&
          queryResult.slice(slice[0], slice[1]).map((item, index) => {
            return (
              <Card.Grid
                key={index}
                // bordered={false}
                onClick={() => selectVideo(index)}
                // loading={loading}
                style={{ display: "inline-block" }}
              >
                <Meta
                  avatar={<Avatar size={96} shape="square" src={item.url} />}
                  description={item.title}
                  style={{
                    textAlign: "center",
                    height: "100px",
                    overflow: "hidden",
                  }}
                />
              </Card.Grid>
            );
          })}
      </Card>
      <Button
        type="primary"
        icon={<DownOutlined style={{ fontSize: "2rem" }} />}
        onClick={extendSearch}
        size="large"
        style={{ display: "block", margin: "1rem auto", width: "20%" }}
      />
    </div>
  );
};

export default SearchVideo;
