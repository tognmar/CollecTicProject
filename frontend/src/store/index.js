import userReducer from "./Slices/User"
import UserTicketsReducer from "./Slices/Tickets"
import themeReducer from "./Slices/Themes"
import otherUserReducer from "./Slices/Users/"
import ProfileReducer from "./Slices/Profile/"
import FilterReduce from "./Slices/FilterProfileFetch"
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    user: userReducer,
    UserTickets: UserTicketsReducer,
    otherUsers: otherUserReducer,
    profile: ProfileReducer,
    themes: themeReducer,
    filter: FilterReduce,
  },
});
export default store;
