<template>

<div class="bg-white shadow overflow-hidden sm:rounded-md">
  <ul>
    <li class="border-b border-gray-200 last:border-b-0"  v-for="{Name, Clip, Updated} in last" :key="Name">
      <router-link :to="`/${Name}`" class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
        <div class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="text-sm leading-5 font-medium text-indigo-600 truncate">
              {{Name}}
            </div>

          </div>
          <div class="mt-2 sm:flex sm:justify-between">
            <div class="sm:flex">
              <div class="mr-6 flex items-center text-sm leading-5 text-gray-500">
                <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {{Clip}}
              </div>

            </div>
            <div class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              <span>
                Updated on
                <time :datetime="Updated">{{Updated}}</time>
              </span>
            </div>

          </div>
        </div>
      </router-link>
    </li>

  </ul>
</div>

</template>

<script>

import { useClipper } from '../compositions/useAirtable.js';
import { onMounted, reactive } from 'vue';
export default {
  name: 'Home',
  setup () {
    const { airtable: clips, } = useClipper('Clips');
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
            { field: 'Updated', direction: 'desc', },
          ],
          view: 'List',
        })
        .firstPage(function (err, records) {
          if (err) {
            return;
          }
          records.forEach(record => {
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

    onMounted(() => { getRecords(); });

    return { last, };
  },
};
</script>
