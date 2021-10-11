<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
      <div
        class="
          -ml-4
          -mt-2
          flex
          items-center
          justify-between
          flex-wrap
          sm:flex-no-wrap
        "
      >
        <div class="ml-4 mt-2 flex items-center gap-3">
          <button class="p-2" @click="$router.back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ params.catchAll }}
          </h3>
        </div>
        <div class="hidden sm:block ml-4 mt-2 flex-shrink-0">
          <div class="ml-4 flex flex-shrink-0 items-center">
            <div class="flex items-center text-sm md:text-base">
              <button
                @click="save"
                type="button"
                class="
                  inline-block
                  rounded-lg
                  font-medium
                  leading-none
                  py-2
                  px-3
                  focus:outline-none
                  bg-indigo-50
                  text-indigo-700
                  hover:bg-indigo-100
                "
              >
                Save
              </button>
            </div>
            <div class="flex sm:items-center">
              <div class="pl-4 pr-3 self-stretch">
                <div class="h-full border-l border-gray-200"></div>
              </div>
              <button
                v-show="supported"
                type="button"
                @click="copy(clip)"
                class="ml-3 text-gray-400 hover:text-gray-500"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <title>Copy</title>
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path
                    d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-4 py-5 sm:p-6">
      <div class="w-full flex rounded-md shadow-sm">
        <textarea
          id="clipboard"
          rows="15"
          class="
            form-textarea
            block
            w-full
            transition
            duration-150
            ease-in-out
            sm:text-sm
            sm:leading-5
          "
          v-model="clip"
        ></textarea>
      </div>
      <p class="mt-2 text-sm text-gray-500">Write what you want to save.</p>
    </div>
    <div class="border-t border-gray-200 px-4 py-4 sm:hidden">
      <div class="sm:hidden flex justify-end">
        <div class="flex flex-shrink-0 items-center">
          <div class="flex items-center text-sm md:text-base">
            <button
              @click="save"
              type="button"
              class="
                inline-block
                rounded-lg
                font-medium
                leading-none
                py-2
                px-3
                focus:outline-none
                text-indigo-700
                bg-indigo-50
                hover:bg-indigo-100
              "
            >
              Save
            </button>
          </div>
          <div class="flex sm:items-center">
            <div class="pl-4 pr-3 self-stretch">
              <div class="h-full border-l border-gray-200"></div>
            </div>
            <button
              v-show="supported"
              type="button"
              @click="copy(clip)"
              class="ml-3 text-gray-400 hover:text-gray-500"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <title>Copy</title>
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path
                  d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useClipper } from '../compositions/useAirtable.js';
import { useClipboard } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
export default {
  setup () {
    const { airtable: clips, } = useClipper('Clips');
    const { params, } = useRoute();

    const { copy, supported, } = useClipboard();

    const clip = ref('');
    const id = ref('');

    function getRecord () {
      clips
        .select({
          fields: [
            'Name',
            'Clip',
          ],
          filterByFormula: `({Name} = '${params.catchAll}')`,
          maxRecords: 1,
          view: 'List',
        })
        .firstPage(function (err, records) {
          if (err) {
            return;
          }
          if (records.length) {
            const record = records[0];
            clip.value = record.get('Clip');
            id.value = record.id;
          }
        });
    }

    function createRecord () {
      clips.create([
        {
          fields: {
            Name: params.catchAll,
            Clip: clip.value,
            Updated: Date.now(),
          },
        },
      ]);
    }

    function updateRecord () {
      clips.update([
        {
          id: id.value,
          fields: {
            Name: params.catchAll,
            Clip: clip.value,
            Updated: Date.now(),
          },
        },
      ]);
    }

    function save () {
      if (id.value) {
        updateRecord();
      } else {
        createRecord();
      }
    }

    onMounted(() => {
      getRecord();
    });

    return { clip, params, copy, supported, save, };
  },
};
</script>
