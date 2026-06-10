<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-6 mt-2">
      <h1 class="text-h5 font-weight-bold text-grey-darken-3">Upravljanje kategorijama</h1>
      <v-btn color="blue-darken-3" prepend-icon="mdi-plus" @click="otvoriDodaj">Nova kategorija</v-btn>
    </div>

    <v-card border flat>
      <v-table hover>
        <thead>
          <tr>
            <th class="font-weight-balck text-blue-darken-3">Naziv kategorije</th>
            <th class="font-weight-black text-blue-darken-3 text-center">Akcije</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="k in popisKategorija" :key="k.id">
            <td class="font-weight-bold">{{ k.naziv }}</td>
            <td class="text-center ">
              <v-btn icon="mdi-pencil" variant="text" color="amber-darken-3" @click="otvoriUredi(k)" class="mr-2"></v-btn>
              <v-btn icon="mdi-delete" variant="text" color="red-darken-2" @click="obrisiKategoriju(k.id)"></v-btn>
            </td>
          </tr>
          <tr v-if="popisKategorija.length === 0">
            <td colspan="2" class="text-center py-4 text-grey">Nema upisanih kategorija</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="dijalog" max-width="400px">
      <v-card class="pa-4">
        <v-card-title class="font-weight-bold">{{ jeUredivanje ? 'Uredi kategoriju' : 'Dodaj kategoriju' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="kategorija.naziv" label="Naziv kategorije" variant="outlined"></v-text-field>
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
const popisKategorija = ref<any[]>([]);
const dijalog = ref(false);
const jeUredivanje = ref(false);
const trenutniId = ref<number | null>(null);
const kategorija = ref({ naziv: ''})

async function dohvatiKategorije() {
  const odg = await fetch(`${API_URL}/kategorije`)
  if (odg.ok) popisKategorija.value = await odg.json();
}

function otvoriDodaj() {
  jeUredivanje.value = false;
  trenutniId.value = null;
  kategorija.value = { naziv: ''};
  dijalog.value = true;
}

function otvoriUredi(k: any) {
  jeUredivanje.value = true;
  trenutniId.value = k.id;
  kategorija.value = { naziv: k.naziv };
  dijalog.value = true;
}

async function spremiPodatke() {
  if (!kategorija.value.naziv) {
    alert("Naziv je obavezan");
    return;
  }
  let url = `${API_URL}/kategorije`;
  let method = 'POST';

  if (jeUredivanje.value && trenutniId.value) {
    url =`${API_URL}/kategorije/${trenutniId.value}`;
    method = 'PUT';
  }

  try {
    const odg = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naziv: kategorija.value.naziv })
    });

    if (odg.ok) {
      dijalog.value = false;
      kategorija.value = { naziv: '' };
      await dohvatiKategorije();
    } else {
      alert("Greška pri spremanju.");
    }
  } catch (e) {
    console.error(e);
    alert("Greška u komunikaciji s backendom.");
  }
}

async function obrisiKategoriju(id: number) {
  if (confirm("Sigurno želiš obrisati ovu kategoriju?")) {
    const odg = await fetch(`${API_URL}/kategorije/${id}`, { method: 'DELETE' });
    if (odg.ok) dohvatiKategorije();
  }
}

onMounted(() => {
  dohvatiKategorije();
});
</script>
