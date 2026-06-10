<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4 mt-2">
      <h1 class="text-h5 font-weight-bold text-grey-darken-3">Upravljanje tvrtkama</h1>
      <v-btn color="blue-darken-3" prepend-icon="mdi-plus" @click="otvoriDodaj">Nova tvrtka</v-btn>
    </div>

    <v-text-field
      v-model="search"
      label="Pretraži tvrtke po nazivu ili gradu..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      class="mb-6"
      bg-color="white"
      clearable
      hide-details
    ></v-text-field>

    <v-row>
      <v-col
        v-for="t in filtriraneTvrtke"
        :key="t.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card border flat class="pa-4 rounded-lg h-100 d-flex flex-column justify-space-between">
          <div>
            <div class="d-flex align-center mb-3">
              <v-icon color="blue-darken-3" class="mr-2">mdi-domain</v-icon>
              <h2 class="text-h6 font-weight-bold text-grey-darken-3">{{ t.naziv }}</h2>
            </div>

            <div class="mb-2 text-body-2 text-grey-darken-1">
              <v-icon size="small" color="grey" class="mr-1">mdi-map-marker</v-icon>
              <strong>Grad:</strong> {{ t.grad }}
            </div>
            <div class="mb-4 text-body-2 text-grey-darken-1">
              <v-icon size="small" color="grey" class="mr-1">mdi-email-outline</v-icon>
              <strong>Kontakt:</strong> {{ t.kontakt || 'Nema kontakta' }}
            </div>
          </div>

          <v-card-actions class="pa-0 justify-end border-t pt-2">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              color="amber-darken-3"
              @click="otvoriUredi(t)"
              class="mr-2"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="red-darken-2"
              @click="obrisiTvrtku(t.id)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" v-if="filtriraneTvrtke.length === 0" class="text-center py-8 text-grey">
        <v-icon size="large" color="grey-lighten-1" class="mb-2">mdi-domain-off</v-icon>
        <p>Nema pronađenih tvrtki za pojam "{{ search }}".</p>
      </v-col>
    </v-row>

    <v-dialog v-model="dijalog" max-width="450px">
      <v-card class="pa-4 rounded-lg">
        <v-card-title class="font-weight-bold px-2 pb-4">
          {{ jeUredivanje ? 'Uredi tvrtku' : 'Dodaj novu tvrtku' }}
        </v-card-title>

        <v-card-text class="pa-2">
          <v-text-field
            v-model="tvrtka.naziv"
            label="Naziv tvrtke"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>

          <v-select
            v-model="tvrtka.grad"
            :items="['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Mostar', 'Sarajevo', 'Poreč', 'Pula', 'Zadar']"
            label="Odaberi grad"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-select>

          <v-text-field
            v-model="tvrtka.kontakt"
            label="Kontakt telefon ili email"
            variant="outlined"
            density="comfortable"
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="justify-end pt-4">
          <v-btn variant="text" @click="dijalog = false">Odustani</v-btn>
          <v-btn color="blue-darken-3" variant="flat" class="px-4" @click="spremiPodatke">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const API_URL = 'http://127.0.0.1:5005';
const popisTvrtki = ref<any[]>([]);
const dijalog = ref(false);
const jeUredivanje = ref(false);
const trenutniId = ref<number | null>(null);

const search = ref('');

const tvrtka = ref({
  naziv: '',
  grad: '',
  kontakt: ''
});


const filtriraneTvrtke = computed(() => {
  if (!search.value) {
    return popisTvrtki.value;
  }
  const pojam = search.value.toLowerCase();


  return popisTvrtki.value.filter(t =>
    t.naziv.toLowerCase().includes(pojam) ||
    t.grad.toLowerCase().includes(pojam)
  );
});


async function dohvatiTvrtke() {
  try {
    const odg = await fetch(`${API_URL}/tvrtke`);
    if (odg.ok) {
      popisTvrtki.value = await odg.json();
    }
  } catch (e) {
    console.error("Greška pri dohvaćanju tvrtki:", e);
  }
}

function otvoriDodaj() {
  jeUredivanje.value = false;
  trenutniId.value = null;
  tvrtka.value = { naziv: '', grad: '', kontakt: '' };
  dijalog.value = true;
}

// 3. OTVORI ZA UREĐIVANJE
function otvoriUredi(t: any) {
  jeUredivanje.value = true;
  trenutniId.value = t.id;
  tvrtka.value = { naziv: t.naziv, grad: t.grad, kontakt: t.kontakt };
  dijalog.value = true;
}

// 4. SPREMANJE PODATAKA (POST / PUT)
async function spremiPodatke() {
  if (!tvrtka.value.naziv.trim() || !tvrtka.value.grad) {
    alert("Naziv i grad su obavezni!");
    return;
  }

  let url = `${API_URL}/tvrtke`;
  let metoda = 'POST';

  if (jeUredivanje.value && trenutniId.value) {
    url = `${API_URL}/tvrtke/${trenutniId.value}`;
    metoda = 'PUT';
  }

  try {
    const odg = await fetch(url, {
      method: metoda,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        naziv: tvrtka.value.naziv.trim(),
        grad: tvrtka.value.grad,
        kontakt: tvrtka.value.kontakt.trim()
      })
    });

    if (odg.ok) {
      dijalog.value = false;
      await dohvatiTvrtke();
    } else {
      alert("Greška prilikom spremanja.");
    }
  } catch (e) {
    console.error(e);
  }
}

async function obrisiTvrtku(id: number) {
  if (confirm("Sigurno želiš obrisati ovu tvrtku?")) {
    try {
      const odg = await fetch(`${API_URL}/tvrtke/${id}`, { method: 'DELETE' });
      if (odg.ok) {
        await dohvatiTvrtke();
      }
    } catch (e) {
      console.error(e);
    }
  }
}

onMounted(() => {
  dohvatiTvrtke();
});
</script>