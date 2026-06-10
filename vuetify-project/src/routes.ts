import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import Pocetna from "@/views/Pocetna.vue";
import Tvrtke from "@/views/Tvrtke.vue";
import Kategorije from "@/views/Kategorije.vue";
import Oglasi from "@/views/Oglasi.vue";
import Prijave from "@/views/Prijave.vue";

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'Pocetna', component: Pocetna },
    {path: '/tvrtke', name: 'Tvrtke', component: Tvrtke },
    {path: '/kategorije', name: 'Kategorije', component: Kategorije },
    {path: '/oglasi', name: 'Oglasi', component: Oglasi },
    {path: '/prijave', name: 'Prijave', component: Prijave }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router