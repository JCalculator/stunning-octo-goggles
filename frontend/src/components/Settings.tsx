import React, { useState, useEffect } from 'react';
import { AvailableLanguage } from '../utils/common';
import moment from 'moment';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from './hooks/useTheme';

interface SettingsProps  {
  setApplicationDate: (date: string) => void;
  setApplicationLanguage: (language: AvailableLanguage) => void
}

const EN_LANGUAGE: AvailableLanguage = {
  code: 'en',
  name: 'English',
};

const Settings = React.memo(({setApplicationDate, setApplicationLanguage} : SettingsProps) => {
  const [languages, setLanguages] = useState<AvailableLanguage[]>([EN_LANGUAGE]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(EN_LANGUAGE.code);
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_FEED_API}/available-languages`;
    fetch(url)
      .then((response) => response.json())
      .then((data: AvailableLanguage[]) => {
        setLanguages(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setApplicationDate(moment(selectedDate).format('YYYY-MM-DD'));
  }, [selectedDate, setApplicationDate]);

  useEffect(() => {
    const value = languages.find((lang) => lang.code === selectedLanguage);
    if (value) {
      setApplicationLanguage(value);
    }
  }, [languages, selectedLanguage, setApplicationLanguage]);

  const handleValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleDateChange', moment(event.target.value))
    setSelectedDate(event.target.value);
  };

  return (
    <div className="flex flex-col fixed top-0 right-0 mt-6 mr-6">
      <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      <div className="mb-2">
        <label htmlFor="value">Language:</label>
        <select
          id="language"
          name="language"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={selectedLanguage}
          onChange={handleValueChange}
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date">Start content date:</label>
        <input type="date" id="date" className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-1 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6' value={selectedDate} onChange={handleDateChange} />
      </div>
    </div>
  );
});

export default Settings;