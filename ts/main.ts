import {TweetElement} from "./tweetElement";
import {TimeLineUI} from "./ui/timelineui";
import {Environments} from "./environments";
import {SocketController} from "./socket/socketController";
import {TwitterController} from "./twitter/twitterController";

var env = new Environments();
var timeLineUI = new TimeLineUI();
var socket  = new SocketController(env);
var twitter = new TwitterController(env);

env.timeLineUI = timeLineUI;
env.socket     = socket;

timeLineUI.addNewTimeLine("home");
timeLineUI.addNewTimeLine("reply");
timeLineUI.addNewTimeLine("dm");
timeLineUI.addNewTimeLine("search");