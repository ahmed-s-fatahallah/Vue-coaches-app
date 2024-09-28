<template>
  <div>
    <base-dialog :show="!!error" title="An Error Occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <section><coach-filter @change-filter="setFilters"></coach-filter></section>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadCoaches(true)"
            >Refresh</base-button
          >
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn"
            >Login to register as a coach</base-button
          >
          <base-button
            link
            to="/register"
            v-if="!isCoach && !isLoading && isLoggedIn"
            >Register As Coach</base-button
          >
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasCoaches">
          <CoachItem
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :firstName="coach.firstName"
            :lastName="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          >
          </CoachItem>
        </ul>
        <h3 v-else>No Coaches Found.</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachItem from './../../components/CoachItem';
import CoachFilter from '../../components/CoachFilter';

export default {
  components: {
    CoachItem,
    CoachFilter,
  },

  data() {
    return {
      isLoading: false,
      error: null,
      activeFilters: {
        frontend: true,
        backend: true,
        career: true,
      },
    };
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    isCoach() {
      return this.$store.getters['coaches/isCoach'];
    },
    filteredCoaches() {
      const coaches = this.$store.getters['coaches/coaches'];
      return coaches.filter((coach) => {
        if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
          return true;
        }
        if (this.activeFilters.backend && coach.areas.includes('backend')) {
          return true;
        }
        if (this.activeFilters.career && coach.areas.includes('career')) {
          return true;
        }
        return false;
      });
    },
    hasCoaches() {
      return !this.isLoading && this.$store.getters['coaches/hasCoaches'];
    },
  },
  methods: {
    async loadCoaches(refresh = false) {
      try {
        this.isLoading = true;
        await this.$store.dispatch('coaches/loadCoaches', {
          forceRefresh: refresh,
        });
      } catch (err) {
        this.error = err.message || 'Something went wrong!';
      } finally {
        this.isLoading = false;
      }
    },
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    handleError() {
      this.error = null;
    },
  },
  created() {
    this.loadCoaches();
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
