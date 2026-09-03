export interface ContentPack {
  id: string;
  label: string;
  description: string;
  items: string[];
}

export const CONTENT_PACKS: ContentPack[] = [
  {
    id: "bible-people",
    label: "Bible People",
    description: "Old & New Testament figures",
    items: [
      "Moses", "Abraham", "David", "Goliath", "Noah", "Jonah", "Daniel", "Esther",
      "Ruth", "Solomon", "Elijah", "Elisha", "Samson", "Delilah", "Joseph", "Jacob",
      "Isaac", "Sarah", "Rebekah", "Mary, mother of Jesus", "Peter", "Paul",
      "John the Baptist", "Judas Iscariot", "Mary Magdalene", "Lazarus",
      "Nicodemus", "Zacchaeus", "Doubting Thomas", "Matthew", "Luke", "Mark",
      "John the Apostle", "James", "Timothy", "Barnabas", "Stephen the Martyr",
      "Philip the Evangelist", "Nathanael", "Andrew", "Gideon", "Deborah",
      "Job", "Isaiah", "Jeremiah", "Ezekiel", "Nehemiah", "Hannah", "Rahab",
    ],
  },
  {
    id: "bible-places-events",
    label: "Bible Places & Events",
    description: "Locations and key moments in scripture",
    items: [
      "Garden of Eden", "Mount Sinai", "The Red Sea parting", "Jericho",
      "Bethlehem", "Nazareth", "Jerusalem", "The Jordan River", "Mount of Olives",
      "Gethsemane", "Golgotha", "Egypt", "Babylon", "Sea of Galilee",
      "Damascus Road", "The Upper Room", "Tower of Babel", "Noah's Ark",
      "The Ten Commandments", "The Ten Plagues", "The Exodus", "The Crucifixion",
      "The Resurrection", "The Ascension", "The Last Supper",
      "The Sermon on the Mount", "The walls of Jericho falling",
      "Feeding of the 5,000", "Water turned to wine", "The raising of Lazarus",
      "The burning bush", "Manna from heaven", "Walking on water",
      "The Prodigal Son returning", "David and Goliath", "Daniel in the lions' den",
      "The fiery furnace", "Jonah and the great fish",
    ],
  },
  {
    id: "holy-spirit",
    label: "Holy Spirit & Spiritual Gifts",
    description: "Pentecostal distinctives",
    items: [
      "Baptism of the Holy Spirit", "Speaking in tongues", "Gift of prophecy",
      "Gift of healing", "Gift of discernment", "Interpretation of tongues",
      "Word of knowledge", "Word of wisdom", "Gift of faith", "Gift of miracles",
      "Fruit of the Spirit", "The anointing", "Slain in the Spirit",
      "Laying on of hands", "The altar call", "Tarrying for the Spirit",
      "Holy Ghost fire", "The Upper Room experience", "The Day of Pentecost",
      "Rivers of living water", "Filled with the Spirit",
      "A sound of a rushing mighty wind", "Tongues of fire",
      "Praying in the Spirit", "Spiritual warfare", "Deliverance",
      "Casting out demons", "Divine healing", "Prophetic word",
      "Discerning of spirits", "Speaking a word in due season",
    ],
  },
  {
    id: "pentecostal-history",
    label: "Pentecostal History & Figures",
    description: "Movement roots and key names",
    items: [
      "Azusa Street Revival", "William J. Seymour", "Charles Parham",
      "Assemblies of God", "Church of God in Christ", "Topeka Bible School",
      "The 1906 Los Angeles Revival", "Aimee Semple McPherson",
      "Smith Wigglesworth", "Kathryn Kuhlman", "T. L. Osborn", "Oral Roberts",
      "The Charismatic renewal", "Full Gospel", "Pentecostal Holiness Church",
      "Divine healing crusades", "Tent revival meetings",
    ],
  },
  {
    id: "gospel-music",
    label: "Gospel Music & Hymns",
    description: "Song and artist names — no lyrics, just titles",
    items: [
      "Amazing Grace", "How Great Thou Art", "Blessed Assurance",
      "It Is Well With My Soul", "Great Is Thy Faithfulness", "To God Be the Glory",
      "Victory Is Mine", "I'll Fly Away", "Higher Ground", "Pass Me Not",
      "Just As I Am", "When We All Get to Heaven", "Total Praise", "Oh Happy Day",
      "Order My Steps", "I Won't Complain", "Kirk Franklin", "Yolanda Adams",
      "CeCe Winans", "Fred Hammond", "Donnie McClurkin", "Marvin Sapp",
      "Tasha Cobbs Leonard", "Tamela Mann", "Hezekiah Walker", "Israel Houghton",
      "William McDowell", "Travis Greene", "Jonathan McReynolds", "Todd Dulaney",
    ],
  },
  {
    id: "worship-church-life",
    label: "Worship & Church Life",
    description: "Familiar Pentecostal service moments",
    items: [
      "Shouting hallelujah", "Raising hands in worship", "Dancing in the Spirit",
      "Running the aisles", "A praise break", "Testimony service", "The altar call",
      "The prayer line", "A tarry service", "Choir robes", "The tambourine",
      "Communion", "Water baptism by immersion", "A foot washing service",
      "Revival meeting", "Camp meeting", "Sunday school", "Vacation Bible School",
      "Offering time", "Praise dance", "Anointing with oil", "Midnight prayer",
      "Fasting and prayer", "Getting the Holy Ghost", "Speaking in the Spirit",
      "Praise and worship team", "The mother's board", "Usher board",
    ],
  },
];
