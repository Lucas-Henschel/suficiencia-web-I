import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import ListView from "@/views/ListView.vue";
import AddView from "@/views/AddView.vue";
import EditView from "@/views/EditView.vue";
import RemoveView from "@/views/RemoveView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: "/",
          name: "list",
          component: ListView,
        },
        {
          path: "/add",
          name: "add",
          component: AddView,
        },
        {
          path: "/edit",
          name: "edit",
          component: EditView,
        },
        {
          path: "/remove",
          name: "remove",
          component: RemoveView,
        },
      ],
    },
  ],
});

export default router;
