import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContentManagement } from './pages/ContentManagement';
import { Metrics } from './pages/Metrics';
import { MetricDetail } from './pages/MetricDetail';
import { PendingLocations } from './pages/locations/PendingLocations';
import { PendingReviews } from './pages/reviews/PendingReviews';
import PlacesList from './pages/feed/places/PlacesList';
import FeedEditor from './pages/feed/places/FeedEditor';
import LocationsList from './pages/locations/LocationsList';
import AddLocation from './pages/locations/AddLocation';
import { Categories } from './pages/categories/Categories';
import { Tags } from './pages/tags/Tags';
import PlaceDetailsView from './pages/placeDetails/PlaceDetailsView';
import { BottomNav } from './components/navigation/BottomNav';
import { useTelegram } from './hooks/useTelegram';
import { Profile } from './pages/profile/Profile';
import { api } from './utils/api';
import { message } from 'antd';

function App() {
  useTelegram();

  useEffect(() => {
    // Отправляем данные пользователя при инициализации
    api.sendUserData().catch((error) => {
      console.error('Error sending user data:', error);
      message.error('Ошибка при отправке данных пользователя');
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-16">
        <Routes>
          <Route path="/" element={<ContentManagement />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/metrics/:id" element={<MetricDetail />} />
          <Route path="/locations" element={<LocationsList />} />
          <Route path="/locations/add" element={<AddLocation />} />
          <Route path="/locations/pending" element={<PendingLocations />} />
          <Route path="/reviews/pending" element={<PendingReviews />} />
          <Route path="/feed" element={<FeedEditor />} />
          <Route path="/places" element={<PlacesList />} />
          <Route path="/places/:id" element={<PlaceDetailsView />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
