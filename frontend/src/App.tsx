import { useState } from 'react';
import Settings from './components/Settings';
import Feed from './components/Feed';
import { AvailableLanguage } from './utils/common';

function App() {
  const [language, setLanguage] = useState<AvailableLanguage>();
  const [date, setDate] = useState<string>('');

  return (
    <>
      <header className="fixed w-full flex top-0 mb-48 z-30 dark:bg-gray-800 bg-white h-56 pt-12">
        <Settings setApplicationDate={setDate} setApplicationLanguage={setLanguage} />
      </header>
      <div className="mt-56">
        {date !== '' && !!language && <Feed date={date} language={language} />}
      </div>
      
    </>
  )
}

export default App
