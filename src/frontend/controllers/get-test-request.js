export default isNewSession => ({
  meta: {
    client_id: 'ru.yandex.searchplugin/7.16 (none none; android 4.4.2)',
    interfaces: {
      account_linking: {},
      payments: {},
      screen: {}
    },
    locale: 'ru-RU',
    timezone: 'UTC'
  },
  request: {
    command: isNewSession ? '' : 'тест',
    nlu: {
      entities: [],
      tokens: isNewSession ? [] : ['тест'],
    },
    original_utterance: isNewSession ? 'Запусти навык тест' : 'Тест',
    type: 'SimpleUtterance'
  },
  session: {
    message_id: isNewSession ? 0 : 1,
    new: isNewSession,
    session_id: 'test-session-id',
    skill_id: 'test-skill-id',
    user_id: 'test-user-id'
  },
  version: '1.0'
});
