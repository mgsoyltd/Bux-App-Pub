import React, { useState, useContext } from 'react'
import { HomeContainer, HomeBg, VideoBg, HomeContent, HomeH1, HomeP, HomeBtnWrapper, ArrowForward, ArrowRight } from "./HomeElements";
import Video from "../../videos/video.mp4";
import { Button } from '../ButtonElements';
import { AppContext } from "../../appContext";
import strings from "../../services/textService";

const HomeSection = ({ onToggle }) => {
    const [hover, setHover] = useState(false);
    const [state] = useContext(AppContext);

    strings.setLanguage(state.language); // Set default language

    const onHover = () => {
        setHover(!hover);
    }

    return (
        < HomeContainer id="home" >
            <HomeBg>
                <VideoBg autoPlay loop muted src={Video} type="video/mp4" />
            </HomeBg>
            <HomeContent>
                <HomeH1>{strings.app_title}</HomeH1>
                <HomeP>{strings.app_desc}</HomeP>
                <HomeBtnWrapper>
                    <Button onClick={onToggle} onMouseEnter={onHover} onMouseLeave={onHover}
                        primary='true' dark='true'>
                        {strings.start_reading} {hover ? <ArrowForward /> : <ArrowRight />}
                    </Button>
                </HomeBtnWrapper>
            </HomeContent>
        </HomeContainer >
    )
}

export default HomeSection;