import { ShakaError } from "@/lib/types/shaka-error";
import { VideoPlayerProps } from "@/lib/types/video-player-interface";
import { createRef, PureComponent, RefObject } from "react";
import "shaka-player/dist/controls.css";
const shaka = require("shaka-player/dist/shaka-player.ui.js");
class ShakaPlayer extends PureComponent {
  videoContainer: RefObject<HTMLDivElement>;
  video: RefObject<HTMLVideoElement>;
  extractedFilename: string;
  constructor(props: VideoPlayerProps) {
    super(props);
    this.video = createRef();
    this.videoContainer = createRef();
    this.extractedFilename = props.filename.replace(/\.[^.]+$/, "");
  }
  componentDidMount() {
    const video = this.video.current;
    const videoContainer = this.videoContainer.current;

    const player = new shaka.Player();
    player.attach(video);
    new shaka.ui.Overlay(player, videoContainer, video);
    // const controls = ui.getControls();

    const onError = (error: ShakaError) => {
      // Log the error.
      console.error("Error code", error.code, "object", error);
    };

    player
      .load(
        `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/${this.extractedFilename}/${this.extractedFilename}.mpd`
      )
      .then(function () {
        // This runs if the asynchronous load is successful.
        console.log("The video has now been loaded!");
      })
      .catch(onError); // onError is executed if the asynchronous load fails.
  }
  render() {
    const { autoPlay } = this.props as Readonly<VideoPlayerProps>;
    return (
      <div data-shaka-player-container ref={this.videoContainer}>
        {/* video height will be same height as video frame which is 9:16 aspect ratio */}
        <video
          data-shaka-player
          autoPlay={autoPlay}
          loop={true}
          id="video"
          ref={this.video}
          className="h-full w-full"
        />
      </div>
    );
  }
}
export default ShakaPlayer;
