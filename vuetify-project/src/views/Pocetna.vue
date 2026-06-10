<template>
  <v-container class="pa-0">
    <h2 class="text-h5 font-weight-bold mb-4">Nadzorna ploča</h2>
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card border color="blue-lighten-5" variant="flat" class="pa-4">
          <div class="text-overline text-grey">Ukupno tvrtki</div>
          <div class="text-h4 font-weight-bold text-green-darken-2">{{ statistika.ukupno_tvrtki }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card border color="blue-lighten-5" variant="flat" class="pa-4">
          <div class="text-overline text-grey">Aktivni oglasi</div>
          <div class="text-h4 font-weight-bold text-green-darken-2">{{ statistika.ukupno_oglasa }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card border color="blue-lighten-5" variant="flat" class="pa-4">
          <div class="text-overline text-grey">Ukupno prijava</div>
          <div class="text-h4 font-weight-bold text-green-darken-2">{{ statistika.ukupno_prijava }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card border color="blue-lighten-5" variant="flat" class="pa-4">
          <div class="text-overline text-grey">Prosječna satnica</div>
          <div class="text-h4 font-weight-bold text-green-darken-2">{{ statistika.prosjecna_satnica }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>

      <v-col cols="12" md="6">
        <v-card border flat class="pa-4 rounded-lg">
          <div class="d-flex align-center mb-3">
            <v-icon color="green-darken-2" class="mr-2">mdi-briefcase-outline</v-icon>
            <h2 class="text-h6 font-weight-bold text-grey-darken-3">Najnoviji oglasi za posao</h2>
          </div>

          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="font-weight-bold">Naslov oglasa</th>
                <th class="font-weight-bold text-right">Satnica</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in popisOglasa.slice(0, 3)" :key="o.id">
                <td>{{ o.naslov }}</td>
                <td class="text-right font-weight-bold text-green-darken-2">{{ o.satnica }} €/h</td>
              </tr>
              <tr v-if="!popisOglasa || popisOglasa.length === 0">
                <td colspan="2" class="text-center py-4 text-grey">Nema unesenih oglasa.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card border flat class="pa-4 rounded-lg">
          <div class="d-flex align-center mb-3">
            <v-icon color="amber-darken-2" class="mr-2">mdi-account-clock-outline</v-icon>
            <h2 class="text-h6 font-weight-bold text-grey-darken-3">Zadnje prijave studenata</h2>
          </div>

          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="font-weight-bold">Student</th>
                <th class="font-weight-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in popisPrijava.slice(0, 3)" :key="p.id">
                <td class="font-weight-medium">{{ p.ime_prezime_studenta }}</td>
                <td class="text-center">
                  <v-chip size="x-small" :color="p.status === 'odobren' ? 'green' : p.status === 'odbijen' ? 'red' : 'amber'" class="text-white font-weight-bold text-uppercase">
                    {{ p.status || 'na čekanju' }}
                  </v-chip>
                </td>
              </tr>
              <tr v-if="!popisPrijava || popisPrijava.length === 0">
                <td colspan="2" class="text-center py-4 text-grey">Nema nedavnih prijava.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, onMounted} from "vue";

  const API_URL = 'http://127.0.0.1:5005'

  const popisOglasa = ref<any[]>([])
  const popisPrijava = ref<any[]>([])

  const statistika = ref({
    ukupno_tvrtki: 0,
    ukupno_oglasa: 0,
    ukupno_prijava: 0,
    prosjecna_satnica: 0
  })

  async function dohvatiStatistiku() {
    try {
      const poveznica = await fetch(`${API_URL}/dashboard-statistika`)
      statistika.value = await poveznica.json()
    } catch (greska) {
      console.log("Ima greska sa backendom (statistika):", greska)
    }
  }

  async function dohvatiOglase() {
    try {
      const poveznica = await fetch(`${API_URL}/oglasi`)
      const odgovorJson = await poveznica.json()
      popisOglasa.value = odgovorJson.podaci || []
    } catch (greska) {
      console.log("Greška pri dohvaćanju oglasa:", greska)
    }
  }

  async function dohvatiPrijave() {
    try {
      const poveznica = await fetch(`${API_URL}/prijave`)
      popisPrijava.value = await poveznica.json()
    } catch (greska) {
      console.log("Greška pri dohvaćanju prijava:", greska)
    }
  }

  onMounted(() => {
    dohvatiStatistiku()
    dohvatiOglase()
    dohvatiPrijave()
  })
</script>