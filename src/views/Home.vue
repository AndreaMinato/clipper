<template>
  <div class="overflow-y-auto bg-white shadow">
    <div class="inline-block min-w-full">
      <ul class="overflow-y-auto">
        <li
          class="border-b border-gray-200 last:border-b-0"
          v-for="{ Name, Clip, Updated } in last"
          :key="Name"
        >
          <div

            class="
              block
              bg-white
              hover:bg-gray-50
              transition
              duration-150
              ease-in-out
            "
          >
            <div class="px-4 py-4 sm:px-6 grid grid-cols-6 gap-2 row-gap-5">
                <router-link
                  :to="`/${Name}`"
                  class="text-sm leading-5 font-medium text-indigo-600 truncate col-span-3"
                >
                  {{ Name }}
                </router-link>

                 <div
                  class="

                    flex
                    items-center
                    justify-end
                    text-sm
                    leading-5
                    text-gray-500
                    sm:mt-0
                    col-span-3

                  "
                >
                  <svg
                    class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>
                    <time :datetime="Updated">{{ Updated }}</time>
                  </span>
              </div>

                  <p
                    class="
                        col-span-6
                      flex
                      items-center
                      text-sm
                      leading-5
                      text-gray-500
                    break-all
                    "
                  >
                    {{ Clip }}
                  </p>

            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useClipBase } from '../compositions/useAirtable.js';
import { onMounted, reactive } from 'vue';
export default {
  name: 'Home',
  setup () {
    const { airtable: clips, } = useClipBase('Clips');
    const last = reactive([]);

    function getRecords () {
      clips
        .select({
          fields: [
            'Name',
            'Clip',
            'Updated',
          ],
          maxRecords: 15,
          sort: [
            {
              field: 'Updated',
              direction: 'desc',
            },
          ],
          view: 'List',
        })
        .firstPage(function (err, records) {
          if (err) {
            return;
          }
          records.forEach((record) => {
            const date = new Date(record.get('Updated'));
            const dateTimeFormat = new Intl.DateTimeFormat('en', {
              timeStyle: 'short',
              dateStyle: 'medium',
              hour12: 'false',
            });

            last.push({
              Clip: record.get('Clip'),
              Name: record.get('Name'),
              Updated: dateTimeFormat.format(date),
            });
          });
        });
    }

    onMounted(() => {
      getRecords();
    });

    return { last, };
  },
};
</script>
