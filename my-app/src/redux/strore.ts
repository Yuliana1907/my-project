import { ThunkAction, Action, configureStore } from '@reduxjs/toolkit'
import athletesSlice from './reducers/athletesSlice'
import brandsSlice from './reducers/brandsSlice'
import dropsSlice from './reducers/dropsSlice'
import editionSlice from './reducers/editionsSlice'
import momentsSlice from './reducers/momentsSlice'
import placesSlice from './reducers/placesSlice'
import savedCardsSlice from './reducers/savedCardsSlice'
import sportTypeSlice from './reducers/sportTypeSlice'
import userSlice from './reducers/userSlice'

export const store = configureStore({
  reducer: {
    drops: dropsSlice,
    user: userSlice,
    editions: editionSlice,
    saleEdition: editionSlice,
    savedCards: savedCardsSlice,
    moments: momentsSlice,
    sportTypes: sportTypeSlice,
    athletes: athletesSlice,
    brands: brandsSlice,
    places: placesSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>