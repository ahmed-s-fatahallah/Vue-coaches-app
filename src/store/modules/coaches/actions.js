export default {
  async registerCoach(context, payload) {
    const userId = context.rootGetters.userId;
    const coachData = {
      firstName: payload.first,
      lastName: payload.last,
      description: payload.desc,
      hourlyRate: payload.rate,
      areas: payload.areas,
    };

    const token = context.rootGetters.token;

    const res = await fetch(
      `https://vuecourse-3a737-default-rtdb.europe-west1.firebasedatabase.app/coaches/${userId}.json?auth=${token}`,
      {
        method: 'PUT',
        body: JSON.stringify(coachData),
      }
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch');
    }

    context.commit('registerCoach', {
      ...coachData,
      id: userId,
    });
  },
  async loadCoaches(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }
    const res = await fetch(
      `https://vuecourse-3a737-default-rtdb.europe-west1.firebasedatabase.app/coaches.json`
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch');
    }

    const coaches = [];
    for (const key in data) {
      const coach = {
        id: key,
        firstName: data[key].firstName,
        lastName: data[key].lastName,
        description: data[key].descriptions,
        hourlyRate: data[key].hourlyRate,
        areas: data[key].areas,
      };
      coaches.push(coach);
    }
    context.commit('setCoaches', coaches);
    context.commit('setFetchedTimeStamp');
  },
};
