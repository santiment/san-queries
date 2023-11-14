<script>
  import noDataSvg from './no-data.svg'
</script>

<no-data class="column hv-center">
  <img class="no-data mrg-l mrg--b" src={noDataSvg} alt="No data" />
  <h2 class="body-2 txt-b">No data</h2>
  <p>Run your query first</p>
</no-data>

<style>
  no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
  }
</style>
