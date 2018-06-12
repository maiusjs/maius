interface IMaiusViewOpt {
  extension?: string;
  /*
  * these options will get passed to the view engine
  */
  options?: any;
  /*
  * map a file extension to an engine
  */
  map?: any;
  /*
  * replace consolidate as default engine source
  */
  engineSource?: any;
}
