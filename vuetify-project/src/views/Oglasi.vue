<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-6 mt-2">
      <h1 class="text-h5 font-weight-bold text-grey-darken-3">Upravljanje oglasima</h1>
      <v-btn color="blue-darken-3" prepend-icon="mdi-plus" @click="otvoriDodaj">Novi oglas</v-btn>
    </div>

    <v-text-field
      v-model="search"
      label="Pretraži oglase po naslovu..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      class="mb-4"
      bg-color="white"
      clearable
      @input="resetirajIPretrazi"
    ></v-text-field>

    <v-card border flat>
      <v-table hover>
        <thead>
          <tr>
            <th class="font-weight-black text-blue-darken-3">Naslov</th>
            <th class="font-weight-black text-blue-darken-3">Opis</th>
            <th class="font-weight-black text-blue-darken-3">Satnica</th>
            <th class="font-weight-black text-blue-darken-3">Kategorija</th>
            <th class="font-weight-black text-blue-darken-3">Tvrtka</th>
            <th class="font-weight-black text-blue-darken-3 text-center">Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in popisOglasa" :key="o.id">
            <td class="font-weight-bold">{{ o.naslov }}</td>
            <td>{{ o.opis }}</td>
            <td><v-chip color="green-darken-2" size="small" variant="flat" class="text-white">{{ o.satnica }} KM</v-chip></td>
            <td>{{ o.kategorija || 'Nema' }}</td>
            <td>{{ o.tvrtka || 'Nepoznato' }}</td>
            <td class="text-center">
              <v-btn icon="mdi-pencil" variant="text" color="amber-darken-3" @click="otvoriUredi(o)" class="mr-2"></v-btn>
              <v-btn icon="mdi-delete" variant="text" color="red-darken-2" @click="obrisiOglas(o.id)"></v-btn>
            </td>
          </tr>
          <tr v-if="popisOglasa.length === 0">
            <td colspan="6" class="text-center py-4 text-grey">Nema pronađenih oglasa.</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <div class="d-flex justify-center align-center mt-4" v-if="ukupnoStranica > 1">
      <v-btn :disabled="page === 1" variant="outlined" size="small" @click="page--; dohvatiOglase()">Prethodna</v-btn>
      <span class="mx-4 text-body-2 text-grey-darken-2">Stranica {{ page }} od {{ ukupnoStranica }}</span>
      <v-btn :disabled="page === ukupnoStranica" variant="outlined" size="small" @click="page++; dohvatiOglase()">Sljedeća</v-btn>
    </div>

    <v-dialog v-model="dijalog" max-width="600px">
      <v-card class="pa-4">
        <v-card-title class="font-weight-bold">{{ jeUredivanje ? 'Uredi oglas' : 'Dodaj novi oglas' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="oglas.naslov" label="Naslov oglasa" variant="outlined" class="mb-2"></v-text-field>
          <v-textarea v-model="oglas.opis" label="Opis posla i uvjeti" variant="outlined" class="mb-2" rows="3"></v-textarea>
          <v-text-field v-model="oglas.satnica" label="Satnica (u KM)" type="number" variant="outlined" class="mb-2"></v-text-field>

          <v-select v-model="oglas.kategorija_id" :items="popisKategorija" item-title="naziv" item-value="id" label="Odaberi kategoriju" variant="outlined" class="mb-2"></v-select>
          <v-select v-model="oglas.tvrtka_id" :items="popisTvrtki" item-title="naziv" item-value="id" label="Odaberi tvrtku" variant="outlined"></v-select>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="dijalog = false">Odustani</v-btn>
          <v-btn color="blue-darken-3" variant="flat" @click="spremiPodatke">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted} from "vue";

const API_URL = 'http://127.0.0.1:5005';
const popisOglasa = ref<any[]>([]);
const popisTvrtki = ref<any[]>([]);
const popisKategorija = ref<any[]>([]);

const dijalog = ref(false);
const jeUredivanje = ref(false);
const trenutniId = ref<number | null>(null);

const search = ref('');
const page = ref(1);
const ukupnoStranica = ref(1);

const oglas = ref({ naslov: '', opis: '', satnica: '', kategorija_id: null, tvrtka_id: null});

async function dohvatiOglase() {
  const odg = await fetch(`${API_URL}/oglasi?search=${search.value || ''}&page=${page.value}&per_page=5`)
  if (odg.ok) {
    const rj = await odg.json();
    popisOglasa.value = rj.podaci;
    ukupnoStranica.value = rj.ukupno_stranica;
  }
}

function resetirajIPretrazi() {
  page.value = 1;
  dohvatiOglase();
}

async function ucitajIzbornike() {
  const odgT = await fetch(`${API_URL}/tvrtke`);
  if (odgT.ok) popisTvrtki.value = await odgT.json();

  const odgK = await fetch(`${API_URL}/kategorije`);
  if (odgK.ok) popisKategorija.value = await odgK.json();
}

function otvoriDodaj() {
  jeUredivanje.value = false;
  trenutniId.value = null;
  oglas.value = { naslov: '', opis: '', satnica: '', kategorija_id: null, tvrtka_id: null};
  dijalog.value = true;
}

function otvoriUredi(o: any) {
  jeUredivanje.value = true;
  trenutniId.value = o.id;
  oglas.value = {
    naslov: o.naslov,
    opis: o.opis,
    satnica: o.satnica ? o.satnica.toString() : '',
    kategorija_id: o.kategorija_id,
    tvrtka_id: o.tvrtka_id
  };
  dijalog.value = true;
}

async function spremiPodatke() {
  let url = `${API_URL}/oglasi`;
  let metoda = 'POST';

  if (jeUredivanje.value && trenutniId.value) {
    url = `${API_URL}/oglasi/${trenutniId.value}`;
    metoda = 'PUT';
  }

  const odg = await fetch(url, {
    method: metoda,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      naslov: oglas.value.naslov,
      opis: oglas.value.opis,
      satnica: parseFloat(oglas.value.satnica),
      kategorija_id: oglas.value.kategorija_id ? Number(oglas.value.kategorija_id) : null,
      tvrtka_id: oglas.value.tvrtka_id ? Number(oglas.value.tvrtka_id) : null
  })
});

  if (odg.ok) {
  dohvatiOglase();
  dijalog.value = false;
  }
}

async function obrisiOglas(id: number) {
  if (confirm("Jeste li sigurni da želite obrisati ovaj oglas?")) {
    const odg =  await fetch(`${API_URL}/oglasi/${id}`, { method: 'DELETE'});
    if (odg.ok) dohvatiOglase();
  }
}

onMounted(() => {
  dohvatiOglase();
  ucitajIzbornike();
})
</script>