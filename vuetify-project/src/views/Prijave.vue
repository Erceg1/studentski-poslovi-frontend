<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-6 mt-2">
      <h1 class="text-h5 font-weight-bold text-grey-darken-3">Pregled prijava studenata</h1>
      <v-btn color="blue-darken-3" prepend-icon="mdi-plus" @click="otvoriDodaj">Nova prijava</v-btn>
    </div>

    <v-card border flat>
      <v-table hover>
        <thead>
          <tr>
            <th class="font-weight-black text-blue-darken-3">Ime i prezime studenta</th>
            <th class="font-weight-black text-blue-darken-3">Broj mobitela</th>
            <th class="font-weight-black text-blue-darken-3">Prijavljeni oglas</th>
            <th class="font-weight-black text-blue-darken-3 text-center">Status</th>
            <th class="font-weight-black text-blue-darken-3 text-center">Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in popisPrijava" :key="p.id">
            <td class="font-weight-bold">{{ p.ime_prezime_studenta }}</td>
            <td>{{ p.broj_mobitela }}</td>
            <td><v-chip size="small" color="blue-darken-3" variant="tonal" class="font-weight-medium">{{ p.oglas_naslov || 'Nepoznat oglas' }}</v-chip></td>
            <td class="text-center">
              <v-chip :color="p.status === 'odobren' ? 'green-darken-1' : p.status === 'odbijen' ? 'red-darken-1' : 'amber-darken-2'" size="small" variant="flat" class="text-white text-uppercase font-weight-bold">
                {{ p.status }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn size="small" color="success" class="mr-2 font-weight-bold" @click="promijeniStatus(p.id, 'odobren')">Odobri</v-btn>
              <v-btn size="small" color="error" variant="flat" class="font-weight-bold" @click="promijeniStatus(p.id, 'odbijen')">Odbij</v-btn>
              <v-btn icon="mdi-delete" variant="text" color="red-darken-2" @click="obrisiPrijavu(p.id)"></v-btn>
            </td>
          </tr>
          <tr v-if="popisPrijava.length === 0">
            <td colspan="5" class="text-center py-4 text-grey">Nema prijava u bazi.</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="dijalog" max-width="500px">
      <v-card class="pa-4">
        <v-card-title class="font-weight-bold">Kreiraj novu prijavu</v-card-title>
        <v-card-text>
          <v-text-field v-model="prijava.ime_prezime_studenta" label="Ime i prezime studenta" variant="outlined" class="mb-2"></v-text-field>
          <v-text-field v-model="prijava.broj_mobitela" label="Broj mobitela" variant="outlined" class="mb-2"></v-text-field>

          <v-select
            v-model="prijava.oglas_id"
            :items="popisOglasa"
            item-title="naslov"
            item-value="id"
            label="Odaberi oglas"
            variant="outlined"
          ></v-select>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="dijalog = false">Odustani</v-btn>
          <v-btn color="blue-darken-3" variant="flat" @click="spremiPrijavu">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const API_URL = 'http://127.0.0.1:5005';
const popisPrijava = ref<any[]>([]);
const popisOglasa = ref<any[]>([]);
const dijalog = ref(false);

const prijava = ref({
  ime_prezime_studenta: '',
  broj_mobitela: '',
  oglas_id: null,
  status: 'na čekanju'
});

async function dohvatiPrijave() {
  const odg = await fetch(`${API_URL}/prijave`);
  if (odg.ok) popisPrijava.value = await odg.json();
}

async function dohvatiOglaseZaDropdown() {
  const odg = await fetch(`${API_URL}/oglasi?per_page=100`);
  if (odg.ok) {
    const rj = await odg.json();
    popisOglasa.value = rj.podaci;
  }
}

function otvoriDodaj() {
  prijava.value = { ime_prezime_studenta: '', broj_mobitela: '', oglas_id: null, status: 'na čekanju' };
  dijalog.value = true;
}

async function spremiPrijavu() {
  if (!prijava.value.ime_prezime_studenta || !prijava.value.oglas_id) {
    alert("Ime studenta i oglas su obavezni!");
    return;
  }

  const odg = await fetch(`${API_URL}/prijave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ime_prezime_studenta: prijava.value.ime_prezime_studenta,
      broj_mobitela: prijava.value.broj_mobitela,
      status: prijava.value.status,
      oglas_id: Number(prijava.value.oglas_id)
    })
  });

  if (odg.ok) {
    dohvatiPrijave();
    dijalog.value = false;
  }
}

async function promijeniStatus(id: number, noviStatus: string) {
  const odg = await fetch(`${API_URL}/prijave/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: noviStatus })
  });
  if (odg.ok) dohvatiPrijave();
}

async function obrisiPrijavu(id: number) {
  if (confirm("Jeste li sigurni da želite obrisati ovu prijavu?")) {
    const odg = await fetch(`${API_URL}/prijave/${id}`, { method: 'DELETE' });
    if (odg.ok) dohvatiPrijave();
  }
}

onMounted(() => {
  dohvatiPrijave();
  dohvatiOglaseZaDropdown();
})
</script>